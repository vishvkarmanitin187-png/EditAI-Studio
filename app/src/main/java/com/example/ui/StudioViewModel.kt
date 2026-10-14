package com.example.ui

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.example.data.GeminiService
import com.example.data.MusicTrack
import com.example.data.Project
import com.example.data.ProjectType
import com.example.data.Template
import com.example.data.UserProfile
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.launch

class StudioViewModel : ViewModel() {
    private val geminiService = GeminiService()

    private val _userProfile = MutableStateFlow(UserProfile())
    val userProfile: StateFlow<UserProfile> = _userProfile.asStateFlow()

    private val _projects = MutableStateFlow(
        listOf(
            Project("1", "Vlog Ep 1 - Mumbai Street Food", ProjectType.VIDEO, "2 hours ago", "04:20", true),
            Project("2", "Gaming Montage #5", ProjectType.VIDEO, "Yesterday", "01:15", false),
            Project("3", "YouTube Thumbnail - Tech Review", ProjectType.THUMBNAIL, "2 days ago", "1920x1080", true),
            Project("4", "Lo-Fi Instrumental Beat", ProjectType.AUDIO, "3 days ago", "02:45", false)
        )
    )
    val projects: StateFlow<List<Project>> = _projects.asStateFlow()

    private val _aiChatMessages = MutableStateFlow(
        listOf(
            Pair("assistant", "Namaste! Main EditAI Studio Assistant hoon. Aapko video cinematic banani hai, background remove karna hai, ya auto captions lagane hain? Bataiye!")
        )
    )
    val aiChatMessages: StateFlow<List<Pair<String, String>>> = _aiChatMessages.asStateFlow()

    private val _isAiProcessing = MutableStateFlow(false)
    val isAiProcessing: StateFlow<Boolean> = _isAiProcessing.asStateFlow()

    private val _musicTracks = MutableStateFlow(
        listOf(
            MusicTrack("m1", "Epic Cinematic Trailer", "Cinematic", "02:30", "EditAI Audio Lab"),
            MusicTrack("m2", "Emotional Piano Dreams", "Emotional", "03:15", "Studio Prime"),
            MusicTrack("m3", "Upbeat Vlog Summer", "Vlog", "02:00", "Beats Direct"),
            MusicTrack("m4", "Cyberpunk Gaming Action", "Gaming", "02:45", "SynthWave"),
            MusicTrack("m5", "Devotional Flute Mantra", "Devotional", "04:10", "Heritage Sound")
        )
    )
    val musicTracks: StateFlow<List<MusicTrack>> = _musicTracks.asStateFlow()

    private val _templates = MutableStateFlow(
        listOf(
            Template("t1", "🔥 Trending Reels Beat Sync", "Trending", "9:16", 3, "9s", "Viral EDM Drop #1", "2.4M uses", "EditAI Pro"),
            Template("t2", "⚡ Smooth Slow-Mo 4K", "Instagram Reels", "9:16", 1, "7s", "Slowed & Reverb Lo-Fi", "4.8M uses", "Studio Beats"),
            Template("t3", "✨ 3D Zoom Camera FX", "Trending", "9:16", 4, "12s", "Dreamy Piano Beat", "3.1M uses", "FX Master"),
            Template("t4", "🎬 Cinematic Travel Vlog", "Vlog", "16:9", 5, "15s", "Cinematic Adventure", "980K uses", "Vlogger Pro"),
            Template("t5", "🎮 Gaming Killmontage Sync", "Gaming", "16:9", 4, "10s", "Cyberpunk Bass Drop", "1.5M uses", "Gaming Hub"),
            Template("t6", "🎉 Birthday Celebration Party", "Birthday", "9:16", 3, "10s", "Happy Party Pop", "850K uses", "Party Time"),
            Template("t7", "🌸 Devotional Aarti Status", "Devotional", "9:16", 2, "11s", "Flute & Temple Bells", "620K uses", "Heritage"),
            Template("t8", "🚀 Business & Startup Promo", "Business", "16:9", 3, "14s", "Corporate Inspiring", "410K uses", "Startup Labs")
        )
    )
    val templates: StateFlow<List<Template>> = _templates.asStateFlow()

    fun sendAiCommand(command: String) {
        if (command.isBlank()) return
        _aiChatMessages.update { it + Pair("user", command) }
        _isAiProcessing.value = true

        viewModelScope.launch {
            val reply = geminiService.executeAiCommand(command)
            _aiChatMessages.update { it + Pair("assistant", reply) }
            _isAiProcessing.value = false
            // Reward AI credits
            _userProfile.update { it.copy(aiCredits = it.aiCredits - 1) }
        }
    }

    fun watchRewardedAdForStarter() {
        _userProfile.update {
            val newWatched = it.rewardedAdsWatched + 1
            it.copy(
                rewardedAdsWatched = newWatched,
                isPro = if (newWatched >= 10) true else it.isPro
            )
        }
    }

    fun unlockStarterWithRupees() {
        _userProfile.update { it.copy(isPro = true) }
    }

    fun upgradeToPro() {
        _userProfile.update { it.copy(isPro = true, aiCredits = it.aiCredits + 500) }
    }

    fun loginWithGoogle() {
        _userProfile.update {
            it.copy(
                name = "Rahul Sharma",
                email = "rahul.sharma@gmail.com",
                isGoogleLoggedIn = true,
                aiCredits = it.aiCredits + 50
            )
        }
    }

    fun logout() {
        _userProfile.update { UserProfile() }
    }

    fun createProject(title: String, type: ProjectType) {
        val newProj = Project(
            id = System.currentTimeMillis().toString(),
            title = title,
            type = type,
            lastModified = "Just now",
            durationOrSize = "00:00",
            isCloudBacked = true
        )
        _projects.update { listOf(newProj) + it }
    }

    fun deleteProject(id: String) {
        _projects.update { list -> list.filter { it.id != id } }
    }
}
